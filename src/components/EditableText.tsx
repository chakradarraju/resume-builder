import { Input, Textarea } from "@chakra-ui/react";
import { ChangeEventHandler } from "react";

const EDITABLE_TEXT_CLASS = "border-none focus:outline-none focus-within:bg-gray-100 flex-1 p-0 "

const EditableText: React.FC<{placeholder?: string, className?: string, value?: string, multiline?: boolean, onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>}> = ({placeholder, className, value, multiline, onChange}) => {
  if (multiline) return <Textarea placeholder={placeholder} className={`${EDITABLE_TEXT_CLASS} ${className || ''}`} value={value || ''} onChange={onChange} />
  return <Input placeholder={placeholder} className={`${EDITABLE_TEXT_CLASS} ${className || ''}`} value={value || ''} onChange={onChange} />
}

export default EditableText;