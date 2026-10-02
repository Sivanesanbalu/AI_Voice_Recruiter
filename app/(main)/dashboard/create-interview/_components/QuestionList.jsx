'use client';

import React, { useEffect, useState } from 'react';
import { Loader2Icon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import QuestionListContainer from './QuestionListContainer';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/app/components/supabaseClient';
import { useUser } from '@clerk/clerk-react';

function QuestionList({ formData, interview_id, onCreateLink, questionList, setQuestionList }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      generateQuestionList();
    }
  }, [formData]);

  const generateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post('/api/ai-model', { ...formData });
      console.log('Received questions:', result.data);
      setQuestionList(result.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Server Error, Try Again!');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async () => {
    setSaving(true);
    const generatedId = interview_id || uuidv4();

    const dataToInsert = {
    user_id: formData.user_id,
    jobPosition: formData.jobPosition,
    jobDescription: formData.jobDescription,
    duration: formData.duration,
    type: formData.type,
    questionList: questionList,
    email: user?.emailAddresses[0]?.emailAddress || '',  // get email from Clerk user object
    interview_id: generatedId,
  };

    const { data, error } = await supabase
      .from('interview')
      .insert([dataToInsert])
      
      .select();

    setSaving(false);

    if (error) {
      console.error('Supabase insert error:', error);
      toast.error('Failed to save interview.');
      return;
    }

    toast.success('Interview saved successfully!');
    onCreateLink(generatedId);
  };

  return (
    <div>
      {loading ? (
        <div className="p-5 bg-blue-50 rounded-xl border-primary border-gray-100 flex gap-5 items-center">
          <Loader2Icon className="animate-spin w-6 h-6 text-blue-600" />
          <div>
            <h2 className="font-medium">Generating Interview Questions</h2>
            <p className="text-primary">
              Our AI is crafting personalized questions based on your job position
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm space-y-4">
          {questionList.length === 0 ? (
            <p className="text-gray-500">No questions generated.</p>
          ) : (
            <QuestionListContainer questionList={questionList} />
          )}
        </div>
      )}

      <div className="flex justify-end mt-10">
        <Button onClick={onFinish} disabled={saving}>
          {saving ? 'Saving...' : 'Create Interview Link & Finish'}
        </Button>
      </div>
    </div>
  );
}

export default QuestionList;