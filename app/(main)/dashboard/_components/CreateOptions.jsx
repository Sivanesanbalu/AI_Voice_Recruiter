import Link from 'next/link';
import { Phone, Video } from 'lucide-react';
import React from 'react';

function CreateOptions() {
    return (
        <div className='grid grid-cols-2 gap-5'>
            
            {/* Link to Interview Page */}
            <Link href='/dashboard/create-interview'>
                <div className='bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-2 cursor-pointer'>
                    <Video className='p-3 text-primary bg-blue-50 rounded-lg h-12 w-12' />
                    <h2 className='font-bold'>Create New Interview</h2>
                    <p className='text-gray-500'>Create AI Interviews and schedule them with Candidates</p>
                </div>
            </Link>

            {/* Static Card */}
            <div className='bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-2'>
                <Phone className='p-3 text-primary bg-blue-50 rounded-lg h-12 w-12' />
                <h2 className='font-bold'>Create Screening call</h2>
                <p className='text-gray-500'>Schedule phone screening call with candidates</p>
            </div>
        </div>
    );
}

export default CreateOptions;
