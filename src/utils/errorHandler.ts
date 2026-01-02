export const handleAPIError = (error: any) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        // Unauthorized - handled by interceptor
        break;
      case 403:
        console.error('Permission Denied: You do not have permission to perform this action');
        break;
      case 404:
        console.error('Not Found: Resource not found');
        break;
      case 409:
        console.error('Conflict:', data.error.message || 'Conflict occurred');
        break;
      case 500:
        console.error('Server Error: Server error. Please try again later');
        break;
      default:
        console.error('Error:', data.error?.message || 'An error occurred');
    }
  } else if (error.request) {
    console.error('Network Error: Network error. Please check your connection');
  } else {
    console.error('Unexpected Error: An unexpected error occurred');
  }
};