import fs from 'fs';
import path from 'path';

export interface CreatorProfileData {
  fullName: string;
  title: string;
  photoUrl: string;
  bio: {
    en: string;
    hi: string;
    ur: string;
  };
  lastUpdated: string;
  updatedBy?: string;
}

export interface VTWMember {
  id: string;
  fullName: string;
  role: string;
  designation: string;
  category: 'leadership' | 'field_ops' | 'scientific' | 'community' | 'admin';
  photoUrl?: string;
  bio?: string;
  department?: string;
  contactEmail?: string;
  contactPhone?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}

const CREATOR_PROFILE_PATH = path.join(process.cwd(), 'data', 'creator_profile.json');
const MEMBERS_PATH = path.join(process.cwd(), 'data', 'vtw_members.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure directories exist
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const DEFAULT_CREATOR_PROFILE: CreatorProfileData = {
  fullName: 'Nazish Asad',
  title: 'Creator & Lead Systems Architect',
  photoUrl: '', // Explicitly empty: must NOT display signature; shows neutral placeholder until admin uploads photo
  bio: {
    en: 'Dedicated to wildlife preservation, digital conservation systems, and tiger protection across the Valmiki Tiger Reserve landscape.',
    hi: 'वाल्मीकि टाइगर रिजर्व परिदृश्य में वन्यजीव संरक्षण, डिजिटल संरक्षण प्रणालियों और बाघ सुरक्षा के लिए समर्पित।',
    ur: 'والمیکی ٹائیگر ریزرو میں جنگلی حیات کے تحفظ، ڈیجیٹل کنزرویشن سسٹمز اور باگھوں کے تحفظ کے لیے وقف۔'
  },
  lastUpdated: new Date().toISOString()
};

/**
 * Load creator profile data safely
 */
export function getCreatorProfile(): CreatorProfileData {
  try {
    if (fs.existsSync(CREATOR_PROFILE_PATH)) {
      const raw = fs.readFileSync(CREATOR_PROFILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      // Safety check: ensure signature is NEVER in photoUrl
      if (parsed.photoUrl && (parsed.photoUrl.includes('signature') || parsed.photoUrl.includes('iVBORw0KGgoAAAANSUhEUgAABBAAAAGQCAMAAAAgM2O9'))) {
        parsed.photoUrl = '';
      }
      return { ...DEFAULT_CREATOR_PROFILE, ...parsed };
    }
  } catch (err) {
    console.error('Error reading creator profile:', err);
  }
  return DEFAULT_CREATOR_PROFILE;
}

/**
 * Save creator profile data
 */
export function saveCreatorProfile(data: Partial<CreatorProfileData>, updatedBy?: string): CreatorProfileData {
  const current = getCreatorProfile();
  const updated: CreatorProfileData = {
    ...current,
    ...data,
    bio: {
      ...current.bio,
      ...(data.bio || {})
    },
    lastUpdated: new Date().toISOString(),
    updatedBy: updatedBy || current.updatedBy
  };

  // Safety check: prevent signature from ever being stored as creator photo
  if (updated.photoUrl && (updated.photoUrl.includes('signature') || updated.photoUrl.includes('iVBORw0KGgoAAAANSUhEUgAABBAAAAGQCAMAAAAgM2O9'))) {
    updated.photoUrl = '';
  }

  try {
    fs.writeFileSync(CREATOR_PROFILE_PATH, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving creator profile:', err);
  }
  return updated;
}

/**
 * Save uploaded creator photo from base64 data URL or binary buffer
 */
export function saveCreatorPhotoUpload(base64DataUrl: string, updatedBy?: string): { success: boolean; photoUrl?: string; error?: string } {
  try {
    if (!base64DataUrl || typeof base64DataUrl !== 'string') {
      return { success: false, error: 'Photo data is required.' };
    }

    // Validate mime type
    const mimeMatch = base64DataUrl.match(/^data:(image\/(jpeg|jpg|png|webp));base64,/i);
    if (!mimeMatch && !base64DataUrl.startsWith('/')) {
      return { success: false, error: 'Invalid image format. Supported formats: JPG, PNG, WebP.' };
    }

    // Safety guard: reject if someone accidentally tries to upload the signature as the photo
    if (base64DataUrl.includes('iVBORw0KGgoAAAANSUhEUgAABBAAAAGQCAMAAAAgM2O9')) {
      return { success: false, error: 'The certificate signature cannot be used as the creator photograph.' };
    }

    let photoUrl = '';
    if (mimeMatch) {
      const ext = mimeMatch[2].toLowerCase() === 'jpeg' ? 'jpg' : mimeMatch[2].toLowerCase();
      const base64Data = base64DataUrl.replace(/^data:image\/[a-z]+;base64,/i, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Check size limit: 5MB max
      if (buffer.length > 5 * 1024 * 1024) {
        return { success: false, error: 'Image size exceeds 5MB limit.' };
      }

      const filename = `creator-photo-${Date.now()}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, filename);
      fs.writeFileSync(filePath, buffer);
      photoUrl = `/uploads/${filename}`;
    } else {
      photoUrl = base64DataUrl;
    }

    saveCreatorProfile({ photoUrl }, updatedBy);
    return { success: true, photoUrl };
  } catch (err: any) {
    console.error('Error in saveCreatorPhotoUpload:', err);
    return { success: false, error: err?.message || 'Failed to save creator photo.' };
  }
}

/**
 * Remove creator photo
 */
export function removeCreatorPhoto(updatedBy?: string): CreatorProfileData {
  return saveCreatorProfile({ photoUrl: '' }, updatedBy);
}

// ==========================================
// VTW OFFICIALS & MEMBERS MANAGEMENT
// ==========================================

export function getAllMembers(includeInactive: boolean = false): VTWMember[] {
  try {
    if (fs.existsSync(MEMBERS_PATH)) {
      const raw = fs.readFileSync(MEMBERS_PATH, 'utf-8');
      const members: VTWMember[] = JSON.parse(raw);
      if (Array.isArray(members)) {
        const filtered = includeInactive ? members : members.filter(m => m.isActive !== false);
        return filtered.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      }
    }
  } catch (err) {
    console.error('Error reading VTW members:', err);
  }
  return [];
}

export function saveAllMembers(members: VTWMember[]): void {
  try {
    fs.writeFileSync(MEMBERS_PATH, JSON.stringify(members, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving VTW members:', err);
  }
}

export function addMember(data: Omit<VTWMember, 'id' | 'createdAt' | 'updatedAt'>, updatedBy?: string): VTWMember {
  const members = getAllMembers(true);
  const newMember: VTWMember = {
    ...data,
    id: `vtw-member-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    displayOrder: typeof data.displayOrder === 'number' ? data.displayOrder : members.length + 1,
    isActive: data.isActive !== undefined ? data.isActive : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy
  };
  members.push(newMember);
  saveAllMembers(members);
  return newMember;
}

export function updateMember(id: string, data: Partial<VTWMember>, updatedBy?: string): VTWMember | null {
  const members = getAllMembers(true);
  const index = members.findIndex(m => m.id === id);
  if (index === -1) return null;

  members[index] = {
    ...members[index],
    ...data,
    id, // Immutable ID
    updatedAt: new Date().toISOString(),
    updatedBy
  };

  saveAllMembers(members);
  return members[index];
}

export function deleteMember(id: string): boolean {
  const members = getAllMembers(true);
  const next = members.filter(m => m.id !== id);
  if (next.length === members.length) return false;
  saveAllMembers(next);
  return true;
}

export function saveMemberPhotoUpload(memberId: string, base64DataUrl: string, updatedBy?: string): { success: boolean; photoUrl?: string; error?: string } {
  try {
    const members = getAllMembers(true);
    const member = members.find(m => m.id === memberId);
    if (!member) {
      return { success: false, error: 'Member not found.' };
    }

    const mimeMatch = base64DataUrl.match(/^data:(image\/(jpeg|jpg|png|webp));base64,/i);
    if (!mimeMatch && !base64DataUrl.startsWith('/')) {
      return { success: false, error: 'Invalid image format. Supported: JPG, PNG, WebP.' };
    }

    let photoUrl = '';
    if (mimeMatch) {
      const ext = mimeMatch[2].toLowerCase() === 'jpeg' ? 'jpg' : mimeMatch[2].toLowerCase();
      const base64Data = base64DataUrl.replace(/^data:image\/[a-z]+;base64,/i, '');
      const buffer = Buffer.from(base64Data, 'base64');

      if (buffer.length > 5 * 1024 * 1024) {
        return { success: false, error: 'Image exceeds 5MB limit.' };
      }

      const filename = `member-${memberId}-${Date.now()}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, filename);
      fs.writeFileSync(filePath, buffer);
      photoUrl = `/uploads/${filename}`;
    } else {
      photoUrl = base64DataUrl;
    }

    updateMember(memberId, { photoUrl }, updatedBy);
    return { success: true, photoUrl };
  } catch (err: any) {
    console.error('Error saving member photo:', err);
    return { success: false, error: err?.message || 'Failed to save member photo.' };
  }
}
