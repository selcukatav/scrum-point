package domains

type VoteMessage struct {
	Type     string `json:"type"`
	Size     string `json:"size,omitempty"`
	ClientId string `json:"clientId"`
}

type VoteList struct {
	TaskName string `json:"taskName"`
	Size     string `json:"size"`
}