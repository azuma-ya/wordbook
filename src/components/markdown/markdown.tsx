import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "./markdown.css";

interface Props {
  text?: string;
}

const Markdwon = ({ text }: Props) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="markdown w-full break-words"
      components={{
        h1: ({ node, ...props }) => (
          <h2 {...props} id={node?.position?.start.line.toString()} />
        ),
        h2: ({ node, ...props }) => (
          <h3 {...props} id={node?.position?.start.line.toString()} />
        ),
        h3: ({ node, ...props }) => (
          <h4 {...props} id={node?.position?.start.line.toString()} />
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
};

export default Markdwon;
