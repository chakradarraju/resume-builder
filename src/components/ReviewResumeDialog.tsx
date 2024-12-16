import { useConfig } from "@/app/ConfigContext";
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
import { useState } from "react";
import { HiOutlineAnnotation } from "react-icons/hi";

const ReviewResumeDialog: React.FC<{}> = () => {
  const [url, setUrl] = useState('');
  const [fetchedJD, setFetchedJD] = useState('');
  const {setJobDescription} = useConfig();
  const [open, setOpen] = useState(false);

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
        <Input placeholder="Job description URL" value={url} onChange={e => setUrl(e.target.value)} />
        <Textarea placeholder="Job description" className="max-h-96 overflow-y-scroll" value={fetchedJD} onChange={e => setFetchedJD(e.target.value)} />
      </DialogBody>
      <DialogFooter>
        <Button onClick={fetchJobDescription}>Fetch</Button>
        <Button onClick={() => {
          setJobDescription(fetchedJD);
          setOpen(false);
        }}>Looks good</Button>
      </DialogFooter>
    </DialogContent>
  </DialogRoot>);
}

export default ReviewResumeDialog;