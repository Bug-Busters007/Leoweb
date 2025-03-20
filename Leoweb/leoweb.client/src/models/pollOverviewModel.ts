export interface PollOverview {
  id: number,
  headline: string,
  description: string,
  creator: string,
  release: string,
  close: string,
  votes: Map<string, number>,
  year: number[],
  branch: string[]
}
