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
import Markdown from 'react-markdown';

const ReviewResumeDialog: React.FC<{}> = () => {
  const [url, setUrl] = useState('');
  const [fetchedJD, setFetchedJD] = useState('');
  const {profile, jobDescription, setJobDescription, review: reviewFromContext, setReview: setReviewInContext } = useProfile();
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState('');

  useEffect(() => {
    setFetchedJD(jobDescription);
    setReview(reviewFromContext);
  }, [jobDescription]);

  async function fetchJobDescription() {
    const response = await fetch('/api/jd', { method: 'POST', body: JSON.stringify({ url })});
    if (!response.ok) return;
    const body = await response.json();
    setFetchedJD(body.data);
  }

  async function reviewResumeForJD() {
    setJobDescription(fetchedJD);
    const formData = new FormData();
    formData.append("profile", JSON.stringify(profile));
    formData.append("jd", fetchedJD);
    const response = await fetch('/api/review', { method: 'POST', body: formData });
    if (!response.ok) {
      console.error('Unable to fetch review', response);
      return;
    }
    const body = await response.json();
    setReview(body.review);
    setReviewInContext(body.review);
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
      <DialogBody className="overflow-y-scroll">
        <div className="flex">
          <Input placeholder="Job description URL" value={url} onChange={e => setUrl(e.target.value)} />
          <Button onClick={fetchJobDescription}>Fetch JD</Button>
        </div>
        <Textarea placeholder="Job description" className="max-h-96 overflow-y-scroll" value={fetchedJD} onChange={e => setFetchedJD(e.target.value)} />
        {review && <Markdown children={review} skipHtml />}
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => reviewResumeForJD()}>Review resume for JD</Button>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </DialogRoot>);
}

export default ReviewResumeDialog;