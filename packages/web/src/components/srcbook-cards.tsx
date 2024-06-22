import { CodeLanguageType } from '@srcbook/shared';
import { SrcbookLogo } from './logos';
import { Circle, PlusIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';
import { Button } from './ui/button';

function LongDashedHorizontalLine(props: { className?: string }) {
  return (
    <div className={props.className}>
      <svg width="1000" height="2" viewBox="0 -1 1000 2" xmlns="http://www.w3.org/2000/svg">
        <line
          x1="0"
          y1="0"
          x2="1000"
          y2="0"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="8, 4"
        />
      </svg>
    </div>
  );
}

function LongDashedVerticalLine(props: { className?: string }) {
  return (
    <div className={props.className}>
      <svg width="2" height="1000" viewBox="-1 0 2 1000" xmlns="http://www.w3.org/2000/svg">
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="1000"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="8, 4"
        />
      </svg>
    </div>
  );
}

function CardContainer(props: {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={props.onClick}
      className={cn(
        'group border relative rounded-sm min-w-52 h-[108px] overflow-clip cursor-pointer transition-colors',
        props.className,
      )}
    >
      <LongDashedHorizontalLine className="absolute top-[10px] text-border" />
      <LongDashedHorizontalLine className="absolute bottom-[10px] text-border" />
      <LongDashedVerticalLine className="absolute left-[10px] text-border" />
      <LongDashedVerticalLine className="absolute right-[10px] text-border" />
      <div className="px-5 py-4 h-full flex flex-col justify-between text-sm">{props.children}</div>
    </div>
  );
}

type SrcbookCardPropsType = {
  title: string;
  running: boolean;
  cellCount: number;
  language: CodeLanguageType;
  onClick: () => void;
  onDelete: () => void;
};

export function SrcbookCard(props: SrcbookCardPropsType) {
  function onDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    props.onDelete();
  }

  return (
    <CardContainer
      onClick={props.onClick}
      className={props.running ? 'border-run' : 'hover:border-foreground'}
    >
      <h5 className="font-semibold leading-[18px]">{props.title}</h5>
      <div className="flex items-center justify-between text-tertiary-foreground">
        <div className="text-[13px] flex items-center gap-2">
          {props.running ? (
            <>
              <Circle size={14} strokeWidth={3} className="text-run" />
              <span>Running</span>
            </>
          ) : (
            <>
              <SrcbookLogo className="text-foreground" width={16} height={18} />
              <span>
                {props.cellCount} {props.cellCount === 1 ? 'Cell' : 'Cells'}
              </span>
            </>
          )}
        </div>
        <code className="font-mono group-hover:hidden">
          {props.language === 'javascript' ? 'JS' : 'TS'}
        </code>
        <button
          type="button"
          onClick={onDelete}
          className="hidden group-hover:block hover:text-foreground"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </CardContainer>
  );
}

export const MAX_SRCBOOK_TITLE_LENGTH = 44;

export function isValidSrcbookTitle(title: string) {
  const trimmed = title.trim();
  return trimmed.length > 0 && trimmed.length < MAX_SRCBOOK_TITLE_LENGTH;
}

function CreateSrcbookCard(props: {
  value: string;
  onChange: (value: string) => void;
  onEnterKeyDown: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <CardContainer
      onClick={() => textareaRef.current?.focus()}
      className="hover:border-foreground focus-within:border-foreground focus-within:ring-1 focus-within:ring-foreground"
    >
      <textarea
        ref={textareaRef}
        rows={2}
        autoComplete="off"
        maxLength={MAX_SRCBOOK_TITLE_LENGTH}
        placeholder="New Srcbook"
        value={props.value}
        onChange={(e) => props.onChange(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            props.onEnterKeyDown();
          }
        }}
        className="bg-transparent border-none outline-none font-semibold leading-[18px] resize-none overflow-clip placeholder-foreground group-hover:placeholder-tertiary-foreground"
      ></textarea>
      <div className="-ml-0.5">
        <PlusIcon size={20} />
      </div>
    </CardContainer>
  );
}

export function CreateSrcbookForm(props: {
  defaultLanguage: CodeLanguageType;
  onSubmit: (title: string, language: CodeLanguageType) => void;
}) {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState(props.defaultLanguage);

  function onSubmit() {
    if (isValidSrcbookTitle(title)) {
      props.onSubmit(title, language);
    }
  }

  return (
    <div className="max-w-[214px] space-y-1.5">
      <CreateSrcbookCard value={title} onChange={setTitle} onEnterKeyDown={onSubmit} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <LanguageButton
            value="javascript"
            title="JavaScript Srcbook"
            selected={language === 'javascript'}
            onClick={setLanguage}
          />
          <LanguageButton
            value="typescript"
            title="TypeScript Srcbook"
            selected={language === 'typescript'}
            onClick={setLanguage}
          />
        </div>
        <Button disabled={!isValidSrcbookTitle(title)} onClick={onSubmit}>
          Create
        </Button>
      </div>
    </div>
  );
}

function LanguageButton(props: {
  value: CodeLanguageType;
  title: string;
  selected: boolean;
  onClick: (language: CodeLanguageType) => void;
}) {
  return (
    <button
      title={props.title}
      onClick={() => props.onClick(props.value)}
      className={cn(
        'py-0.5 px-3 font-semibold border-none outline-none ring-0 focus-visible:ring-0',
        props.selected ? 'text-foreground' : 'text-muted-foreground',
      )}
    >
      {props.value === 'javascript' ? 'JS' : 'TS'}
    </button>
  );
}
