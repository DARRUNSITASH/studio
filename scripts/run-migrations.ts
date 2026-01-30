import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function runMigrations() {
    console.log('🚀 Running Supabase Migrations...\n');

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ Error: Supabase credentials not found in .env.local');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const migrations = [
        'supabase/migrations/20240130_create_care_cases.sql',
        'supabase/migrations/20240131_create_core_tables.sql',
    ];

    console.log('⚠️  NOTE: This script uses the anon key which may not have sufficient permissions.');
    console.log('   If you get permission errors, please run the migrations manually in the Supabase dashboard.');
    console.log('   Dashboard URL: https://app.supabase.com/project/yjaeebbiwawkwpcwtfmz/sql\n');

    for (const migrationPath of migrations) {
        const fullPath = path.resolve(process.cwd(), migrationPath);

        if (!fs.existsSync(fullPath)) {
            console.error(`❌ Migration file not found: ${migrationPath}`);
            continue;
        }

        console.log(`📄 Running: ${path.basename(migrationPath)}`);
        const sql = fs.readFileSync(fullPath, 'utf-8');

        try {
            // Note: This might not work with anon key due to permissions
            // The SQL would need to be executed with service role key or via dashboard
            const { error } = await supabase.rpc('exec_sql', { sql_string: sql });

            if (error) {
                console.error(`   ❌ Error: ${error.message}`);
                console.log(`   💡 Please run this migration manually in the Supabase dashboard`);
            } else {
                console.log(`   ✅ Success!`);
            }
        } catch (err) {
            console.error(`   ❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
            console.log(`   💡 Please run this migration manually in the Supabase dashboard`);
        }

        console.log('');
    }

    console.log('\n📋 Manual Migration Instructions:');
    console.log('1. Go to: https://app.supabase.com/project/yjaeebbiwawkwpcwtfmz/sql');
    console.log('2. Click "New Query"');
    console.log('3. Copy and paste the contents of each migration file');
    console.log('4. Click "Run" to execute\n');
}

runMigrations();
