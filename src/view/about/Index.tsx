import React from 'react';
import ReactMarkdown from 'react-markdown';
import * as path from 'path';
import * as fs from 'fs';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { AboutWrapper } from './about.style';
import { RenderHighlighterType } from '../../typings/about';

const aboutMdPath = path.join(__dirname, '..', 'assets', 'docs', 'about.md');
const aboutMd = fs.readFileSync(aboutMdPath).toString();

const renderers = {
  code(props: RenderHighlighterType) {
    const { language, value } = props;
    return (
      <SyntaxHighlighter style={atomOneDark} language={language}>
        {value}
      </SyntaxHighlighter>
    );
  },
};

export default function About() {
  return (
    <AboutWrapper>
      <div className="markdown-body">
        <ReactMarkdown renderers={renderers}>{aboutMd}</ReactMarkdown>
      </div>
    </AboutWrapper>
  );
}
