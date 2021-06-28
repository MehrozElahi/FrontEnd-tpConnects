export interface Role {
  Name: string;
  Description: string;
  RoleTypeId: number;
  ParentRoleId?: any;
  CompanyId: number;
  RoleCategory: number;
  HoldingId?: any;
  Created: Date;
  CreatedBy?: any;
  Updated?: any;
  UpdatedBy?: any;
  RowVersion: string;
  Id: number;
}

export interface Company {
  Name: string;
  Code: string;
  Description: string;
  HoldingId: number;
  IsEnabled: boolean;
  Adress: any[];
  companylogo?: any;
  CompanyModules: any[];
  Website: string;
  Logo: string;
  Created: Date;
  CreatedBy?: any;
  Updated?: any;
  UpdatedBy?: any;
  RowVersion: string;
  Id: number;
}

export interface UserOrganizations {
  CompanyId: number;
  CompanyBranchId?: any;
  BranchReportingId?: any;
  BranchReviewId?: any;
  AgentId: number;
  AgentCode: string;
  AgentType: number;
  AgentBranchId: number;
  AgentBranchCode: string;
  AgentReportingId: any[];
  AgentReviewId: any[];
}

export interface UserType {
  Name: string;
  Description: string;
  Created: Date;
  CreatedBy?: any;
  Updated?: any;
  UpdatedBy?: any;
  RowVersion: string;
  Id: number;
}

export interface TokenJsonModel {
  nbf: number;
  exp: number;
  iss: string;
  aud: string;
  name: string;
  fullname: string;
  isIntegration: boolean;
  uid: number;
  roles: Role[];
  tenant: number;
  company: Company;
  branch: any[];
  departmentId: number;
  user_organizations: UserOrganizations;
  user_type: UserType;
  IsMainBranch: boolean;
}


