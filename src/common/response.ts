interface APIResponseProps {
  success: boolean;
  code: number;
  message: string;
  data?: any;
}

export default class APIResponse {
  public success: boolean;

  public code: number;

  public message: string;

  public data?: any;

  constructor(props: APIResponseProps) {
    this.success = props.success;
    this.code = props.code;
    this.message = props.message;
    this.data = props.data;
  }
}
