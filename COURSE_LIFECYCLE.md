# Course Lifecycle Management

## Lifecycle States

### 1. Draft
- Admin creates course
- Not visible to students
- Can edit all fields
- Auto-saves to localStorage

### 2. Published
- Admin publishes course
- Visible in catalog
- Students can enroll
- Limited editing

### 3. Active
- Students enrolled
- Content delivery
- Progress tracking
- Certificates issued

### 4. Archived
- No new enrollments
- Existing students can complete
- Read-only for admin

### 5. Retired
- Completely hidden
- Historical data preserved
- No student access

## State Transitions

```
Draft → Published → Active → Archived → Retired
  ↓         ↓
  ↓    Unpublished
  ↓         ↓
  └─────────┘
```

## User Flows

### Admin: Create Course
1. Navigate to /admin or /course-builder
2. Fill course details
3. Add lessons & chapters
4. Save as draft
5. Preview
6. Publish

### Student: Enroll
1. Browse catalog
2. View course details
3. Enroll (if has access)
4. Access content
5. Track progress
6. Complete & get certificate

### Admin: Manage Enrollments
1. View student list
2. Grant/revoke access
3. Update user claims
4. Monitor progress

## Technical Implementation

### Data Model
```javascript
{
  id: string,
  status: 'draft' | 'published' | 'active' | 'archived' | 'retired',
  createdAt: timestamp,
  publishedAt: timestamp,
  enrollmentCount: number,
  completionRate: number
}
```

### Access Control
- **Draft**: Admin only
- **Published**: Admin + enrolled students
- **Active**: All with claims
- **Archived**: Read-only
- **Retired**: Admin only (historical)

## Metrics to Track
- Enrollment rate
- Completion rate
- Time to complete
- Student satisfaction
- Content engagement
