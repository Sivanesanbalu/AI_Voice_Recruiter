import React from "react";
import {beforeEach,describe,expect,it,vi} from "vitest";
import {cleanup,render,screen,waitFor} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("./supabase",()=>({
  SUPABASE_KEY:"test-key",
  AI_URL:"https://example.test/functions/v1/interview-ai",
  supabase:{
    auth:{
      getSession:vi.fn(async()=>({data:{session:null}})),
      onAuthStateChange:vi.fn(()=>({data:{subscription:{unsubscribe:vi.fn()}}})),
      signOut:vi.fn(async()=>({error:null})),
      signUp:vi.fn(),
      signInWithPassword:vi.fn(),
      resend:vi.fn(),
      updateUser:vi.fn()
    },
    rpc:vi.fn(async(name)=>{
      if(name==="public_get_interview") return {data:{
        title:"AI Engineer",
        jobDescription:"Build reliable AI systems.",
        durationMinutes:30,
        codingEnabled:true,
        interviewTypes:["Technical"],
        questions:[{id:"q1",question:"Explain RAG",category:"Technical",isCoding:false,maxScore:10}]
      },error:null};
      return {data:null,error:null};
    }),
    from:vi.fn(()=>({
      select:vi.fn().mockReturnThis(),eq:vi.fn().mockReturnThis(),limit:vi.fn(async()=>({data:[],error:null})),
      single:vi.fn(async()=>({data:null,error:null})),maybeSingle:vi.fn(async()=>({data:null,error:null})),
      insert:vi.fn().mockReturnThis(),update:vi.fn().mockReturnThis(),upsert:vi.fn(async()=>({error:null})),
      order:vi.fn(async()=>({data:[],error:null})),in:vi.fn().mockReturnThis(),delete:vi.fn().mockReturnThis()
    })),
    storage:{from:vi.fn(()=>({upload:vi.fn(async()=>({error:null}))}))}
  }
}));

import App,{Auth,Candidate,Home} from "./App.jsx";
import {buildQuestionsPayload,candidateUrl,fmtScore,interviewCategories} from "./helpers.js";

beforeEach(()=>{
  cleanup();
  location.hash="";
  document.body.innerHTML='<div id="root"></div><div id="toast"></div>';
});

describe("InterviewOS smoke",()=>{
  it("landing renders",()=>{
    render(<Home session={null} company={{}} logout={()=>{}}/>);
    expect(screen.getByText(/Structured first-round interviews that run/i)).toBeInTheDocument();
  });

  it("auth renders",()=>{
    render(<Auth mode="login" onAuth={async()=>{}}/>);
    expect(screen.getByText("Company login")).toBeInTheDocument();
  });

  it("protected dashboard route handles unauthenticated user",async()=>{
    location.hash="#dashboard";
    render(<App/>);
    await waitFor(()=>expect(screen.getByText("Company login")).toBeInTheDocument());
  });

  it("candidate route mounts with mocked public interview",async()=>{
    render(<Candidate token="test-token"/>);
    await waitFor(()=>expect(screen.getByText("AI Engineer")).toBeInTheDocument());
    expect(screen.getByText(/30 min/i)).toBeInTheDocument();
  });
});

describe("InterviewOS helpers",()=>{
  it("buildQuestionsPayload uses exact backend keys",()=>{
    expect(buildQuestionsPayload({
      job:" AI Engineer ",
      jd:" Build production AI systems ",
      duration:45,
      types:["Technical","Experience"],
      coding:true
    })).toEqual({
      action:"questions",
      jobPosition:"AI Engineer",
      jobDescription:"Build production AI systems",
      duration:45,
      types:["Technical","Experience"],
      codingEnabled:true
    });
  });

  it("candidateUrl points to candidate token route",()=>{
    expect(candidateUrl("abc","https://example.com")).toBe("https://example.com/#interview/abc");
  });

  it("score and category helpers work",()=>{
    expect(fmtScore(87.6)).toBe("88%");
    expect(interviewCategories({interview_types:["Technical"]})).toEqual(["Technical"]);
  });
});
