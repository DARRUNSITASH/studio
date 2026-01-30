import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testSupabaseConnection() {
    console.log('🔍 Testing Supabase Connection...\n');

    // Check if credentials are set
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ Error: Supabase credentials not found in .env.local');
        console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.');
        process.exit(1);
    }

    console.log('✅ Credentials found:');
    console.log(`   URL: ${supabaseUrl}`);
    console.log(`   Key: ${supabaseAnonKey.substring(0, 20)}...`);
    console.log('');

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
        // Test 1: Check connection
        console.log('📡 Test 1: Checking connection...');
        const { data, error } = await supabase.from('care_cases').select('count');

        if (error) {
            if (error.message.includes('relation "public.care_cases" does not exist')) {
                console.log('⚠️  Tables not created yet. Please run the migrations first.');
                console.log('   See SUPABASE_SETUP.md for instructions.\n');
            } else {
                console.error('❌ Connection error:', error.message);
            }
        } else {
            console.log('✅ Connection successful!\n');
        }

        // Test 2: Check all required tables
        console.log('📋 Test 2: Checking database tables...');
        const tables = ['profiles', 'doctors', 'appointments', 'prescriptions', 'care_cases', 'case_messages'];

        for (const table of tables) {
            const { error: tableError } = await supabase.from(table).select('count').limit(1);
            if (tableError) {
                console.log(`   ❌ ${table}: Not found or no access`);
            } else {
                console.log(`   ✅ ${table}: Ready`);
            }
        }

        console.log('\n✨ Supabase setup test complete!');

    } catch (err) {
        console.error('❌ Unexpected error:', err);
        process.exit(1);
    }
}

testSupabaseConnection();
