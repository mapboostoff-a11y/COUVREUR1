import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';

interface PreviewFrameProps {
  children: React.ReactNode;
  width?: string;
  className?: string;
}

const FrameContext = createContext<Document | null>(null);

export const useFrameDocument = () => useContext(FrameContext);

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ 
  children, 
  width = '100%',
  className = ''
}) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !frame.contentDocument) return;

    const doc = frame.contentDocument;

    // Reset document content
    doc.open();
    doc.write('<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>');
    doc.close();

    // Copy styles from main document
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
    styles.forEach((style) => {
      doc.head.appendChild(style.cloneNode(true));
    });

    // Create a mounting point
    const root = doc.getElementById('root');
    if (root) {
      setMountNode(root);
    }
    
    // Observer to sync new styles (e.g. inserted by styled-components or emotion if used, or Tailwind JIT)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'STYLE' || (node.nodeName === 'LINK' && (node as HTMLLinkElement).rel === 'stylesheet')) {
              doc.head.appendChild(node.cloneNode(true));
            }
          });
        }
      });
    });

    observer.observe(document.head, { childList: true });

    // Sync CSS Variables (Inline styles on html)
    const syncCssVariables = () => {
      const mainRoot = document.documentElement;
      const iframeRoot = doc.documentElement;
      iframeRoot.style.cssText = mainRoot.style.cssText;
    };

    // Initial sync
    syncCssVariables();

    // Observe attribute changes on main html element
    const attrObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          syncCssVariables();
        }
      });
    });

    attrObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

    return () => {
      observer.disconnect();
      attrObserver.disconnect();
    };
  }, []);

  return (
    <iframe 
      ref={frameRef}
      className={`border-0 bg-white transition-all duration-300 ${className}`}
      style={{ width: width, height: '100%' }}
      title="Preview"
    >
      {mountNode && (
        <FrameContext.Provider value={mountNode.ownerDocument}>
          {createPortal(children, mountNode)}
        </FrameContext.Provider>
      )}
    </iframe>
  );
};
