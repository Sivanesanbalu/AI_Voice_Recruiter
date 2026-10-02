"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Send } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

function InterviewCard({ interview, viewDetail = false }) {
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:3000";
  const interviewId = interview.interview_id || interview.id;
  const url = `${hostUrl}/interview/${interviewId}`;
  const candidateCount = interview["interview-feedback"]?.length || 0;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("✅ Link copied to clipboard!");
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("❌ Failed to copy link.");
    }
  };

  const sendLink = () => {
    const subject = encodeURIComponent("Your Interview Link");
    const body = encodeURIComponent(`Here is your interview link: ${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition w-full">
      {/* Top row: blue dot + date */}
      <div className="flex justify-between items-center">
        <div className="w-5 h-5 rounded-full bg-blue-600" />
        <p className="text-sm text-gray-500 font-medium">
          {new Date(interview.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Job title */}
      <div className="mt-4">
        <h3 className="text-md font-semibold text-gray-800">
          {interview.jobPosition}
        </h3>
      </div>

      {/* Duration and Candidate Count Row */}
      <div className="mt-2 flex justify-between text-sm text-gray-600">
        <p>{interview.duration}</p>
        <p className=" text-green-500 text-bold">
          {candidateCount} Candidate{candidateCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Buttons */}
      {viewDetail ? (
      <Link href={'/scheduled-interview/'+interview?.interview_id+"/details"}>
        <Button className="mt-4 w-full" variant="outline">
          View Detail <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </Link>
      ) : (
        <div className="flex gap-3 mt-4"> 
          <Button variant="outline" className="w-1/2" onClick={copyLink}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <Button
            className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={sendLink}
          >
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      )}
    </div>
  );
}

export default InterviewCard;
