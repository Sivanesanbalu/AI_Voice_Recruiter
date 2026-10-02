'use client';

import { Input } from '@/components/ui/input';
import { ArrowLeft, Calendar, Clock, Copy, List, Mail, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { toast } from 'sonner';

function InterviewLink({ interview_id, formData, questionList }) {
  const url = `${process.env.NEXT_PUBLIC_HOST_URL}/interview/${interview_id}`;

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast('Link Copied');
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex flex-col items-center">
      {/* Logo */}
      <Image
        src="/image.png"
        alt="Logo"
        width={100}
        height={100}
        className="mb-6"
      />

      <h2 className="text-2xl font-bold text-center">Your AI Interview is Ready!</h2>

      {/* Show interview details dynamically */}
      {formData && (
        <div className="text-center mt-2 text-gray-700">
          {formData.jobPosition && <p className="font-semibold text-lg">{formData.jobPosition}</p>}
          {/* Only show date/time if these are part of your formData */}
          {(formData.date || formData.time) && (
            <p className="flex justify-center items-center gap-4 mt-1 text-sm text-gray-500">
              {formData.date && (
                <span className="flex items-center gap-1">
                  <Calendar size={16} /> {formData.date}
                </span>
              )}
              {formData.time && (
                <span className="flex items-center gap-1">
                  <Clock size={16} /> {formData.time}
                </span>
              )}
            </p>
          )}
        </div>
      )}

      <p className="text-gray-600 text-center mt-2">
        Share this link with your candidates to start the interview process.
      </p>

      {/* Interview Link Box */}
      <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-6 mt-8">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Interview Link</h3>
          <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
            Valid for 30 Days
          </span>
        </div>

        <div className="mt-4 flex gap-3 items-center">
          <Input
            value={url}
            disabled={true}
            className="flex-1"
          />
          <button
            onClick={onCopyLink}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
          >
            <Copy size={16} /> Copy Link
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
          <List size={16} />
          {questionList?.length ?? 0} Questions
        </div>
      </div>

      {/* Share Via Box */}
      <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-6 mt-5">
        <h3 className="font-semibold mb-4">Share Via</h3>
        <div className="flex gap-4 flex-wrap">
          <a
            href={`mailto:?subject=Interview Link&body=${encodeURIComponent(url)}`}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm"
          >
            <Mail size={16} /> Email
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm"
          >
            <Mail size={16} /> WhatsApp
          </a>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-xl flex justify-between mt-10">
        <Link href="/dashboard">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm">
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </Link>
        <Link href="/create-interview">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
            <Plus size={16} /> Create New Interview
          </button>
        </Link>
      </div>
    </div>
  );
}

export default InterviewLink;
