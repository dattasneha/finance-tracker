import { de } from "zod/locales";

class ApiResponse {
  constructor(data = {}, message = "Success") {
    this.data = data;
    this.message = message;
  }
}

export default ApiResponse;
