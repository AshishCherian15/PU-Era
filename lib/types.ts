// Centralized TypeScript types matching the DB schema

export type ClassLevel = 'puc1' | 'puc2' | 'ncert11' | 'ncert12'
export type Stream = 'science' | 'commerce' | 'arts' | 'common'
export type Board = 'ktbs' | 'ncert'
export type Medium = 'en' | 'kn'
export type ResourceType =
  | 'chapter_notes' | 'short_notes' | 'summary' | 'important_qa'
  | 'formula_sheet' | 'revision_pdf' | 'project_guide' | 'worked_examples'
  | 'lab_guide' | 'lab_video'
export type SourceType = 'own' | 'external_link' | 'permissioned'
export type Licence = 'own' | 'ncert_econtent' | 'written_permission' | 'ktbs_permission' | 'cc_by' | 'govt'
export type ResourceStatus = 'draft' | 'published' | 'scheduled' | 'archived'
export type UserStatus = 'active' | 'warned' | 'suspended' | 'banned'
export type AdminRole = 'owner' | 'admin' | 'editor' | 'moderator' | 'support'
export type AnnouncementStatus = 'draft' | 'scheduled' | 'active' | 'expired' | 'archived'
export type RequestStatus = 'submitted' | 'in_review' | 'approved' | 'in_progress' | 'completed' | 'declined'
export type FeedbackStatus = 'new' | 'acknowledged' | 'investigating' | 'resolved' | 'closed'
export type SuggestionStatus = 'new' | 'reviewing' | 'planned' | 'in_progress' | 'implemented' | 'declined'
export type WarnSeverity = 'notice' | 'warning' | 'final'

export interface Subject {
  id: string
  slug: string
  name: string
  name_kn?: string
  class_level: ClassLevel
  stream: Stream
  board: Board
  has_lab: boolean
  sort_order: number
  active: boolean
  created_at: string
}

export interface Chapter {
  id: string
  subject_id: string
  number: number
  slug: string
  title: string
  title_kn?: string
  syllabus_version?: string
  description?: string
  keywords?: string[]
  status: 'active' | 'inactive'
  created_at: string
}

export interface Resource {
  id: string
  slug: string
  title: string
  description?: string
  type: ResourceType
  subject_id: string
  chapter_id?: string
  medium: Medium
  academic_year?: string
  source_type: SourceType
  licence: Licence
  permission_ref?: string
  file_path?: string
  external_url?: string
  allow_view: boolean
  allow_download: boolean
  status: ResourceStatus
  published_at?: string
  verified_at?: string
  verified_by?: string
  views: number
  downloads: number
  created_at: string
}

export interface Textbook {
  id: string
  subject_id?: string
  board: Board
  class_level: ClassLevel
  subject_name: string
  medium: Medium
  official_url: string
  source_label: string
  last_checked?: string
  is_active: boolean
  notes?: string
  created_at: string
}

export interface LabExperiment {
  id: string
  subject_id: string
  slug: string
  title: string
  aim?: string
  apparatus?: string
  theory?: string
  procedure?: string
  observations?: string
  result?: string
  precautions?: string
  viva_qa?: Array<{ q: string; a: string }>
  related_chapter_id?: string
  status: 'draft' | 'published' | 'archived'
  created_at: string
}

export interface Announcement {
  id: string
  title: string
  body: string
  icon?: string
  accent?: string
  display_style: 'popup' | 'banner' | 'both' | 'page_only'
  audience?: Record<string, string[]>
  priority: 'normal' | 'important' | 'urgent'
  popup_policy: 'once' | 'every_visit' | 'never'
  action_label?: string
  action_url?: string
  publish_at: string
  expires_at?: string
  status: AnnouncementStatus
  created_at: string
}

export interface Profile {
  id: string
  full_name: string
  email: string
  class_level?: ClassLevel
  stream?: Stream
  medium: Medium
  board_focus?: Board
  college_name?: string
  guardian_email?: string
  status: UserStatus
  is_minor: boolean
  email_verified: boolean
  last_login_at?: string
  login_count: number
  created_at: string
  deleted_at?: string
}

export interface Bookmark {
  user_id: string
  resource_id: string
  folder?: string
  created_at: string
}

export interface Progress {
  user_id: string
  chapter_id: string
  done_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  body?: string
  link?: string
  read_at?: string
  created_at: string
}

export interface Request {
  id: string
  user_id: string
  subject_id?: string
  chapter_id?: string
  resource_type?: ResourceType
  description: string
  status: RequestStatus
  priority?: 'low' | 'medium' | 'high'
  admin_reply?: string
  created_at: string
  updated_at: string
}

export interface Suggestion {
  id: string
  user_id: string
  title: string
  body: string
  category?: string
  status: SuggestionStatus
  upvotes: number
  admin_reply?: string
  created_at: string
  updated_at: string
}

export interface Feedback {
  id: string
  user_id?: string
  type: 'general' | 'broken_link' | 'wrong_chapter' | 'content_error' | 'suggestion'
  rating?: number
  message: string
  page_url?: string
  status: FeedbackStatus
  created_at: string
}

// Taxonomy item for static content (fallback before DB is seeded)
export interface TaxonomySubject {
  id: string
  slug: string
  name: string
  class_level: ClassLevel
  stream: Stream
  board: Board
  has_lab: boolean
  sort_order: number
}
