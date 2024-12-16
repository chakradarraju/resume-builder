'use client';
import { Button, Grid, GridItem, Input, Tabs, Text, Textarea } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { HiUpload } from "react-icons/hi";
import { useProfile } from "../ProfileContext";
import Profile, { EMPTY_PROFILE } from "@/types/profile";
import { Field } from "@/components/ui/field";
import {
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import { redirect } from "next/navigation";

const Page: React.FC<{}> = () => {
  const {setProfile, setJobDescription} = useProfile();

  const [stage, setStage] = useState('context');
  
  const [contextTab, setContextTab] = useState('jd');
  const [baseDataTab, setBaseDataTab] = useState('upload');
  
  const [url, setUrl] = useState('');
  const [fetchedJD, setFetchedJD] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');

  const [JDError, setJDError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [parseResumeError, setParseResumeError] = useState('');

  const jdRef = useRef<HTMLTextAreaElement>(null);
  const roleRef = useRef<HTMLInputElement>(null);
  const resumeFileRef = useRef<HTMLInputElement>(null);
  
  const [parsedProfile, setParsedProfile] = useState<Profile>(EMPTY_PROFILE);

  function validateJD() {
    setJDError(fetchedJD.length > 9 ? '' : 'JD too short, it should be at least 10 characters');
    if (fetchedJD.length > 9) return true;
    jdRef.current?.focus();
    return false;
  }

  function validateRole() {
    setRoleError(role.length > 2 ? '' : 'Role should be at least 3 characters');
    if (role.length > 2) return true;
    roleRef.current?.focus();
    return false;
  }

  async function validateResume() {
    if (!resumeFileRef.current?.files) return setParseResumeError('No file selected');
    const file = resumeFileRef.current?.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch('/api/parsepdf', { method: 'POST', body: formData });
    if (!response.ok) {
      const resp = await response.json().catch(console.error);
      setParseResumeError(resp?.error ?? 'Unknown error');
    } else {
      const profile: Profile = await response.json();
      setParsedProfile(profile);  
    }
  }

  function validateContextPage() {
    if (contextTab === "jd") {
      return validateJD();
    }
    if (contextTab === "role") {
      return validateRole();
    }
    return true;
  }
  
  function startResume() {
    if (contextTab === "jd") {
      setJobDescription(fetchedJD);
    } else if (contextTab === "role") {
      var jd = `role: ${role}`;
      if (company) jd += `\ncompany: ${company}`;
      setJobDescription(jd);
    } else {
      setJobDescription('');
    }
    console.log('Before upload check');
    if (baseDataTab === "upload" && parseResumeError.length === 0) {
      setProfile(parsedProfile);
      console.log(parsedProfile);
      redirect('/builder');
    }
    console.log('Done check');
  }

  async function fetchJobDescription() {
    const response = await fetch('/api/jd', { method: 'POST', body: JSON.stringify({ url })});
    if (!response.ok) return;
    const body = await response.json();
    setFetchedJD(body.data);
  }

  return (<div className="flex flex-col w-full h-full bg-gradient-to-t from-blue-500/50 to-blue-500 absolute overflow-scroll text-black">
    <div className="p-[3rem] rounded-[3rem] m-auto bg-white w-[36rem] drop-shadow-md">
      {stage === 'context' && <>
      <Text textStyle="3xl" fontWeight="bold">Create new resume</Text>
      <Tabs.Root variant="enclosed" className="m-5" value={contextTab} onValueChange={e => setContextTab(e.value)}>
        <Tabs.List>
          <Tabs.Trigger value="jd">
            For job description
          </Tabs.Trigger>
          <Tabs.Trigger value="role">
            For job role
          </Tabs.Trigger>
          <Tabs.Trigger value="plain">
            Generic
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="jd">
          <div className="flex">
            <Input placeholder="Job description URL" value={url} onChange={e => setUrl(e.target.value)} />
            <Button onClick={fetchJobDescription}>Fetch JD</Button>
          </div>
          <Field invalid={!!JDError} errorText={JDError}>
            <Textarea placeholder="Job description" ref={jdRef} className="max-h-96 overflow-y-scroll" value={fetchedJD} onChange={e => { validateJD(); setFetchedJD(e.target.value) } } />
          </Field>
        </Tabs.Content>
        <Tabs.Content value="role">
          <Field invalid={!!roleError} errorText={roleError}>
            <Input placeholder="Job role" ref={roleRef} value={role} onChange={e => { validateRole(); setRole(e.target.value); }} />
          </Field>
          <Input placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} />
        </Tabs.Content>
      </Tabs.Root>
      <Button className="w-full mt-3" onClick={() => {
        if (validateContextPage()) {
          setStage('base');
        }
      }}>Next</Button>
    </>}
      {stage === 'base' && <>
      <Text textStyle="3xl" fontWeight="bold">From resume</Text>
      <Tabs.Root variant="enclosed" className="m-5" value={baseDataTab} onValueChange={e => setBaseDataTab(e.value)}>
        <Tabs.List>
          <Tabs.Trigger value="upload">
            Upload pdf
          </Tabs.Trigger>

          <Tabs.Trigger value="empty">
            Empty
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="upload">
          <div className="flex">
            <FileUploadRoot accept="application/pdf,application/json" invalid={parseResumeError.length > 0} ref={resumeFileRef}>
              <FileUploadTrigger asChild>
                <Button variant="outline" size="sm">
                  <HiUpload /> Upload resume
                </Button>
              </FileUploadTrigger>
            </FileUploadRoot>
            <Button onClick={() => validateResume()}>Process</Button>    
          </div>        
        </Tabs.Content>
        <Tabs.Content value="role">
          <Input placeholder="Job role" value={role} onChange={e => setRole(e.target.value)} />
          <Input placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} />
        </Tabs.Content>
      </Tabs.Root>
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        <GridItem>
          <Button className="w-full" onClick={() => setStage('context')}>Back</Button>
        </GridItem>
        <GridItem>
          <Button className="w-full" onClick={startResume}>Start resume</Button>
        </GridItem>
      </Grid>
    </>}
    </div>
  </div>)
}

export default Page;