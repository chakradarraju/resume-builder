import { useProfile } from "@/app/ProfileContext";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, Input, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { HiOutlineAnnotation } from "react-icons/hi";

const ReviewResumeDialog: React.FC<{}> = () => {
  const [url, setUrl] = useState('');
  const [fetchedJD, setFetchedJD] = useState('');
  const {jobDescription, setJobDescription} = useProfile();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setFetchedJD(jobDescription);
  }, [jobDescription]);

  async function fetchJobDescription() {
    const response = await fetch('/api/jd', { method: 'POST', body: JSON.stringify({ url })});
    if (!response.ok) return;
    const body = await response.json();
    setFetchedJD(body.data);
  }

  return (<DialogRoot lazyMount open={open} onOpenChange={e => setOpen(e.open)}>
    <DialogBackdrop />
    <DialogTrigger asChild>
      <Button colorPalette="green" className="mx-2" color="white"><HiOutlineAnnotation /> Review Resume</Button>
    </DialogTrigger>
    <DialogContent color="black" className="max-h-fit">
      <DialogCloseTrigger />
      <DialogHeader>
        <DialogTitle>Fetch job description</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <div className="flex">
          <Input placeholder="Job description URL" value={url} onChange={e => setUrl(e.target.value)} />
          <Button onClick={fetchJobDescription}>Fetch JD</Button>
        </div>
        <Textarea placeholder="Job description" className="max-h-96 overflow-y-scroll" value={fetchedJD} onChange={e => setFetchedJD(e.target.value)} />
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => {
          setJobDescription(fetchedJD);
          setOpen(false);
        }}>Review resume for JD</Button>
      </DialogFooter>
    </DialogContent>
  </DialogRoot>);
}

export default ReviewResumeDialog;