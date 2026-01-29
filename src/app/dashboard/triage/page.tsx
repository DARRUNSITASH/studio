import { SymptomTriage } from "@/components/symptom-triage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export default function TriagePage() {
  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle>AI-Assisted Symptom Checker</CardTitle>
                <CardDescription>
                    Describe your symptoms in the text box below. Our AI will provide a preliminary assessment and suggest the next steps. This is not a substitute for professional medical advice.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SymptomTriage />
            </CardContent>
        </Card>
    </div>
  );
}
