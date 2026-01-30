-- Create care_cases table
CREATE TABLE IF NOT EXISTS care_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'reviewed', 'resolved')),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    urgency TEXT NOT NULL CHECK (urgency IN ('low', 'medium', 'emergency')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create case_messages table
CREATE TABLE IF NOT EXISTS case_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES care_cases(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_status TEXT NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('pending', 'synced'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_care_cases_patient_id ON care_cases(patient_id);
CREATE INDEX IF NOT EXISTS idx_care_cases_doctor_id ON care_cases(doctor_id);
CREATE INDEX IF NOT EXISTS idx_care_cases_updated_at ON care_cases(updated_at);
CREATE INDEX IF NOT EXISTS idx_case_messages_case_id ON case_messages(case_id);
CREATE INDEX IF NOT EXISTS idx_case_messages_timestamp ON case_messages(timestamp);

-- Enable Row Level Security
ALTER TABLE care_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for care_cases
-- Users can view cases where they are either the patient or the doctor
CREATE POLICY "Users can view their own cases"
    ON care_cases FOR SELECT
    USING (
        auth.uid()::text = patient_id OR 
        auth.uid()::text = doctor_id
    );

-- Users can insert cases if they are the patient
CREATE POLICY "Patients can create cases"
    ON care_cases FOR INSERT
    WITH CHECK (auth.uid()::text = patient_id);

-- Users can update cases if they are involved
CREATE POLICY "Involved users can update cases"
    ON care_cases FOR UPDATE
    USING (
        auth.uid()::text = patient_id OR 
        auth.uid()::text = doctor_id
    );

-- RLS Policies for case_messages
-- Users can view messages for cases they're involved in
CREATE POLICY "Users can view messages in their cases"
    ON case_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM care_cases
            WHERE care_cases.id = case_messages.case_id
            AND (
                care_cases.patient_id = auth.uid()::text OR
                care_cases.doctor_id = auth.uid()::text
            )
        )
    );

-- Users can insert messages in cases they're involved in
CREATE POLICY "Users can send messages in their cases"
    ON case_messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM care_cases
            WHERE care_cases.id = case_messages.case_id
            AND (
                care_cases.patient_id = auth.uid()::text OR
                care_cases.doctor_id = auth.uid()::text
            )
        )
        AND auth.uid()::text = sender_id
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_care_cases_updated_at
    BEFORE UPDATE ON care_cases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE care_cases;
ALTER PUBLICATION supabase_realtime ADD TABLE case_messages;
