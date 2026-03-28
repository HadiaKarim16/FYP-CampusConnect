import { mockStorage } from './mockStorage';

const detectFileType = (fileName) => {
  if (!fileName) return 'other';
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.match(/\.doc(x)?$/)) return 'doc';
  if (lower.match(/\.ppt(x)?$/)) return 'ppt';
  if (lower.match(/\.(jpg|jpeg|png|gif)$/)) return 'img';
  return 'other';
};

export const notesApi = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockStorage.get('notes') || [];
  },

  upload: async ({ title, subject, description, fileName, fileSize, tags, isShared }) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newNote = {
      id: `note_${Date.now()}`,
      title,
      subject,
      description,
      fileName,
      fileType: detectFileType(fileName),
      fileSize,
      uploadedBy: 'current_user',
      uploadedAt: new Date().toISOString(),
      tags: tags || [],
      isShared: isShared || false,
      downloadCount: 0,
    };

    mockStorage.update('notes', (current) => {
      return [newNote, ...(current || [])];
    });

    return newNote;
  },

  delete: async (noteId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    mockStorage.update('notes', notes => (notes || []).filter(n => n.id !== noteId));
    return { success: true, id: noteId };
  },

  toggleShare: async (noteId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockStorage.update('notes', notes =>
      (notes || []).map(n => n.id === noteId ? { ...n, isShared: !n.isShared } : n)
    );
    return { success: true, id: noteId };
  },

  // FIX [Bug 7]: Added mock API method to persist download count simulating backend behavior
  incrementDownloadCount: async (noteId) => {
    mockStorage.update('notes', notes =>
      (notes || []).map(n => n.id === noteId ? { ...n, downloadCount: (n.downloadCount || 0) + 1 } : n)
    );
    return { success: true, id: noteId };
  }
};
