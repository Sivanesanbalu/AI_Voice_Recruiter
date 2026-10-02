import React from 'react'
import InterviewDetails from '../page'

function InterviewDetailContainer({ interviewDetail }) {
    return (
        <div>
            <h2>{ interviewDetail?.jobPosition }</h2>
        </div>
    )
}

export default InterviewDetailContainer