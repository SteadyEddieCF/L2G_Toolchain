namespace L2G {
  export interface ProjectState {
    pre_engagement: PreEngagementDomain;
    interviews: InterviewSessionsDomain;
  }

  export interface ReleaseInfo {
    pre_engagement_schema_kind: typeof PRE_ENGAGEMENT_SCHEMA_KIND;
    pre_engagement_schema_version: typeof PRE_ENGAGEMENT_SCHEMA_VERSION;
    interview_schema_kind: typeof INTERVIEW_SCHEMA_KIND;
    interview_schema_version: typeof INTERVIEW_SCHEMA_VERSION;
  }
}
