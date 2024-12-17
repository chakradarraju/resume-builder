import { Input, Textarea } from "@chakra-ui/react";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";

const EDITABLE_TEXT_CLASS = "border-none focus:outline-none focus-within:bg-gray-100 flex-1 p-0 "

enum TextType {
  Text,
  Email,
  Link
}

function getTitle(url?: string) {
  try {
    if (!url) return null;
    const parsedUrl = new URL(url);
    const websiteParts = parsedUrl.hostname.split('.');
    return websiteParts.length > 1 ? (websiteParts[websiteParts.length - 2] +"."+ websiteParts[websiteParts.length - 1]) : parsedUrl.hostname;
  } catch (error) {
    console.error("Invalid URL:", url, error);
    return null;
  }
}

function isValidUrl(str: string): boolean {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(str);
}

function isValidEmail(str: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(str);
}

function getType(str?: string): TextType {
  if (!str) return TextType.Text;
  if (isValidEmail(str)) return TextType.Email;
  if (isValidUrl(str)) return TextType.Link;
  return TextType.Text;
}

const EditableText: React.FC<{placeholder?: string, className?: string, value?: string, multiline?: boolean, onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>, style?: object}> = ({placeholder, className, value, multiline, onChange, style}) => {
  const type = getType(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState<boolean>(false);

  useEffect(() => {
    if (inputRef.current && (type === TextType.Email || type === TextType.Link)) {
      inputRef.current?.focus();
    }
  }, [editing, inputRef]);

  if (multiline) return <Textarea placeholder={placeholder} className={`resize-none hover:resize-y ${EDITABLE_TEXT_CLASS} ${className || ''}`} style={style} value={value || ''} onChange={onChange} />
  if (!editing) {
    if (type === TextType.Email) return (<div onClick={() => setEditing(true)}><a href={`mailto:${value}`} onClick={e => e.preventDefault()}>{value}</a></div>);
    if (type === TextType.Link) return (<div onClick={() => setEditing(true)}><a href={value} onClick={e => e.preventDefault()}>{getTitle(value) ?? value}</a></div>);  
  }
  return <Input placeholder={placeholder} className={`${EDITABLE_TEXT_CLASS} ${className || ''}`} value={value || ''} onChange={onChange} onBlur={() => setEditing(false)} style={style} ref={inputRef} />
}

export default EditableText;