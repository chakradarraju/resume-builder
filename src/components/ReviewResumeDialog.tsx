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
  const [reviewing, setReviewing] = useState(false);
  const [fetchingJD, setFetchingJD] = useState(false);

  useEffect(() => {
    setFetchedJD(jobDescription);
    setReview(reviewFromContext);
  }, [jobDescription]);

  async function fetchJobDescription() {
    setFetchingJD(true);
    const response = await fetch('/api/jd', { method: 'POST', body: JSON.stringify({ url })});
    setFetchingJD(false);
    if (!response.ok) {
      console.log(response.status, response.statusText, await response.text());
      alert('Unable to fetch JD automatically, please manually copy paste the JD');
      return;
    }
    const body = await response.json();
    if (body.from === 'body' || !body.data || body.data.length < 20 || body.data.length > 10000 || body.data.includes('sign in') || body.data.includes('sign up') || body.data.includes('login')) {
      alert('Please verify if the fetched JD looks right if not correct it manually (some JD are access restricted)');
    }
    setFetchedJD(body.data);
  }

  async function reviewResumeForJD() {
    setJobDescription(fetchedJD);
    const formData = new FormData();
    formData.append("profile", JSON.stringify(profile));
    formData.append("jd", fetchedJD);
    setReviewing(true);
    const response = await fetch('/api/review', { method: 'POST', body: formData });
    setReviewing(false);
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
        <DialogTitle>Review resume</DialogTitle>
      </DialogHeader>
      <DialogBody className="overflow-y-scroll">
        {!review && <div>
          <div className="flex">
            <Input placeholder="Job description URL" value={url} onChange={e => setUrl(e.target.value)} />
            <Button disabled={fetchingJD} onClick={fetchJobDescription}>Fetch JD</Button>
          </div>
          <Textarea placeholder="Job description" className="max-h-96 overflow-y-scroll" value={fetchedJD} onChange={e => setFetchedJD(e.target.value)} />
        </div>}
        {review && <Markdown className="max-h-96" children={review} skipHtml />}
      </DialogBody>
      <DialogFooter>
        {!review && <Button disabled={reviewing} onClick={() => reviewResumeForJD()}>Review resume for JD</Button>}
        {review && <Button onClick={() => setReview('')}>Start new review</Button>}
        <Button onClick={() => setOpen(false)}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </DialogRoot>);
}

export default ReviewResumeDialog;