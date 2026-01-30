import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEverything() {
    console.log('🧪 TESTING SUPABASE INTEGRATION\n');
    console.log('='.repeat(60));

    // Test 1: Connection
    console.log('\n📡 Test 1: Connection');
    try {
        const { data, error } = await supabase.from('profiles').select('count');
        if (error) {
            console.log('   ❌ Connection failed:', error.message);
            if (error.message.includes('does not exist')) {
                console.log('   💡 Tables not created yet - run migrations first!');
            }
        } else {
            console.log('   ✅ Connection successful!');
        }
    } catch (err) {
        console.log('   ❌ Error:', err);
    }

    // Test 2: Check Tables
    console.log('\n📋 Test 2: Database Tables');
    const tables = ['profiles', 'doctors', 'appointments', 'prescriptions', 'care_cases', 'case_messages'];

    for (const table of tables) {
        try {
            const { error } = await supabase.from(table).select('count').limit(1);
            if (error) {
                console.log(`   ❌ ${table.padEnd(20)} - ${error.message}`);
            } else {
                console.log(`   ✅ ${table.padEnd(20)} - Ready`);
            }
        } catch (err) {
            console.log(`   ❌ ${table.padEnd(20)} - Error`);
        }
    }

    // Test 3: Insert Test Doctor
    console.log('\n👨‍⚕️ Test 3: Create Test Doctor');
    try {
        const { data, error } = await supabase.from('doctors').insert([{
            name: 'Dr. Test Doctor',
            specialty: 'General Medicine',
            experience: 5,
            rating: 4.5,
            patients_count: 100,
            image: 'https://via.placeholder.com/150',
            available: true
        }]).select();

        if (error) {
            console.log('   ❌ Failed:', error.message);
        } else {
            console.log('   ✅ Doctor created successfully!');
            console.log('   📝 Doctor ID:', data[0].id);
        }
    } catch (err) {
        console.log('   ❌ Error:', err);
    }

    // Test 4: Fetch Doctors
    console.log('\n📖 Test 4: Fetch Doctors');
    try {
        const { data, error } = await supabase.from('doctors').select('*');
        if (error) {
            console.log('   ❌ Failed:', error.message);
        } else {
            console.log(`   ✅ Found ${data.length} doctor(s)`);
            data.forEach((doc: any) => {
                console.log(`      - ${doc.name} (${doc.specialty})`);
            });
        }
    } catch (err) {
        console.log('   ❌ Error:', err);
    }

    // Test 5: Create Test Appointment
    console.log('\n📅 Test 5: Create Test Appointment');
    try {
        const { data, error } = await supabase.from('appointments').insert([{
            patient_id: 'test-patient-1',
            patient_name: 'Test Patient',
            doctor_id: 'test-doctor-1',
            doctor_name: 'Dr. Test',
            date: '2024-02-15',
            time: '10:00 AM',
            status: 'scheduled',
            type: 'Consultation'
        }]).select();

        if (error) {
            console.log('   ❌ Failed:', error.message);
        } else {
            console.log('   ✅ Appointment created successfully!');
            console.log('   📝 Appointment ID:', data[0].id);
        }
    } catch (err) {
        console.log('   ❌ Error:', err);
    }

    // Test 6: Create Test Care Case
    console.log('\n💬 Test 6: Create Test Care Case');
    try {
        const { data: caseData, error: caseError } = await supabase.from('care_cases').insert([{
            patient_id: 'test-patient-1',
            patient_name: 'Test Patient',
            doctor_id: 'test-doctor-1',
            doctor_name: 'Dr. Test',
            status: 'pending',
            subject: 'Test Consultation',
            description: 'This is a test case',
            urgency: 'low'
        }]).select();

        if (caseError) {
            console.log('   ❌ Failed:', caseError.message);
        } else {
            console.log('   ✅ Care case created successfully!');
            console.log('   📝 Case ID:', caseData[0].id);

            // Add a message to the case
            const { error: msgError } = await supabase.from('case_messages').insert([{
                case_id: caseData[0].id,
                sender_id: 'test-patient-1',
                sender_name: 'Test Patient',
                content: 'Hello, this is a test message!',
                sync_status: 'synced'
            }]);

            if (msgError) {
                console.log('   ❌ Message failed:', msgError.message);
            } else {
                console.log('   ✅ Message added to case!');
            }
        }
    } catch (err) {
        console.log('   ❌ Error:', err);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Testing Complete!\n');
    console.log('Next Steps:');
    console.log('1. Check your Supabase dashboard to see the test data');
    console.log('2. Open your app and verify data appears');
    console.log('3. Try creating appointments/messages in the UI\n');
}

testEverything();
