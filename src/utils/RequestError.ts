import { CustomError } from "ts-custom-error";

class RequestError extends CustomError {
  public constructor(
    public code: number,
    public message: string,
    public status: number
  ) {
    super(message);
  }
}

export default RequestError;
