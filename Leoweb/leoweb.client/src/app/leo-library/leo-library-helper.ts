import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../services/api.service";

export async function getAllSubjectsFromBranch(http: HttpClient, apiService: ApiService, branch: string) :Promise<string[]|undefined> {
  const url = apiService.getApiUrl(`Notes/allSubjectsFromBranch?branch=${branch}`);
  return await http.get<string[]>(url).toPromise();
}
