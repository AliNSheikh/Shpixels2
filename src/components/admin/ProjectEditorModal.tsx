import React from 'react';
import { ProjectItem } from '../../types/content';
import { ProjectEditor } from './ProjectEditor';

interface ProjectEditorModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: ProjectItem) => void;
  onDelete?: (id: string) => void;
}

export function ProjectEditorModal({ project, isOpen, onClose, onSave, onDelete }: ProjectEditorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#171717] border border-[#2b2b2b] shadow-2xl">
        <ProjectEditor
          project={project}
          onSave={(updated) => {
            onSave(updated);
            onClose();
          }}
          onCancel={onClose}
          onDelete={onDelete ? (id) => {
            onDelete(id);
            onClose();
          } : undefined}
        />
      </div>
    </div>
  );
}

export { ProjectEditor };
