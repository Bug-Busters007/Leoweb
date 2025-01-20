import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../services/api.service";
import { firstValueFrom } from "rxjs";

export async function getAllBranchesWithSubjects(http: HttpClient, apiService: ApiService) :Promise<Map<string, string[]> | undefined> {
  console.log("x");
  const url = apiService.getApiUrl(`Notes/allBranchesWithSubjects`);
  const response = await firstValueFrom(http.get<Map<string, string[]>>(url));

  return new Map<string, string[]>(Object.entries(response));
}

export async function getAllBranches(http: HttpClient, apiService: ApiService): Promise<string[]|undefined> {
  const url = apiService.getApiUrl(`Notes/allBranches`);
  return await firstValueFrom(http.get<string[]>(url));
}
