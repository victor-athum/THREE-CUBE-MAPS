import HttpErrorResponseModel from '../models/HttpErrorResponseModel';

const RequestMethod = {
  Get: 'GET',
  Post: 'POST',
  Put: 'PUT',
  Delete: 'DELETE',
  Options: 'OPTIONS',
  Head: 'HEAD',
  Patch: 'PATCH'
};

export default class HttpUtility {
  static async get(endpoint, params, requestConfig) {
    const paramsConfig = params || undefined;
    return HttpUtility.request(
      {
        url: endpoint,
        method: RequestMethod.Get
      },
      {
        ...paramsConfig,
        ...requestConfig
      }
    );
  }

  static async post(endpoint, data) {
    const config = data || undefined;
    return HttpUtility.request(
      {
        url: endpoint,
        method: RequestMethod.Post
      },
      config
    );
  }

  static async put(endpoint, data) {
    const config = data || undefined;

    return HttpUtility.request(
      {
        url: endpoint,
        method: RequestMethod.Put
      },
      config
    );
  }

  static async delete(endpoint, data) {
    const config = data || undefined;

    return HttpUtility.request(
      {
        url: endpoint,
        method: RequestMethod.Delete
      },
      config
    );
  }

  static async request(restRequest, config) {
    if (!restRequest.url) {
      console.error(
        `Received ${restRequest.url} which is invalid for a endpoint url`
      );
    }

    try {
      const url = restRequest?.url;
      const requestConfig = {
        method: restRequest.method,
        headers: {
          'Content-Type': 'application/json',
          ...config?.headers
        },
        ...config
      };

      const [response] = await Promise.all([
        fetch(url, requestConfig),
        HttpUtility.delay()
      ]);
      const json = await response.json();
      const { response: jsonResponse, data } = json;
      if (jsonResponse === 'error') {
        return HttpUtility.fillInErrorWithDefaults(
          {
            status: jsonResponse,
            message: data.message,
            url: restRequest.url,
            raw: response
          },
          restRequest
        );
      }

      return json;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        const { status, statusText } = error.response;

        return HttpUtility.fillInErrorWithDefaults(
          {
            status: status.toString(),
            message: statusText,
            url: error.request.responseURL,
            raw: error.response
          },
          restRequest
        );
      }
      if (error.request) {
        // The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
        const { status, statusText, responseURL } = error.request;

        return HttpUtility.fillInErrorWithDefaults(
          {
            status: status.toString(),
            message: statusText,
            url: responseURL,
            raw: error.request
          },
          restRequest
        );
      }

      // Something happened in setting up the request that triggered an Error
      return HttpUtility.fillInErrorWithDefaults(
        {
          status: '',
          message: error.message,
          url: restRequest.url,
          raw: error
        },
        restRequest
      );
    }
  }

  static fillInErrorWithDefaults(error, request) {
    const model = new HttpErrorResponseModel();

    model.status = error.status || 0;
    model.message = error.message || 'Error requesting data';
    model.url = error.url || request.url;
    model.raw = error.raw;

    return model;
  }

  /**
   * We want to show the loading indicator to the user but sometimes the api
   * request finished too quickly. This makes sure there the loading indicator is
   * visual for at least a given time.
   *
   * @param duration
   * @returns {Promise<unknown>}
   * @private
   */
  static delay(duration = 250) {
    return new Promise((resolve) => setTimeout(resolve, duration));
  }
}
