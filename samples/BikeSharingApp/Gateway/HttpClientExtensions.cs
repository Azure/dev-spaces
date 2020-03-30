// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System.Net.Http;
using Microsoft.AspNetCore.Http;

namespace app
{
    public static class HttpClientExtensions
    {
        public static HttpRequestMessage AddOutboundHeaders(this HttpRequestMessage message, HttpRequest originRequest)
        {
            message.Headers.Add(Constants.RequestIdHeaderName, OperationContext.CurrentContext.RequestId.ToString());
            message.Headers.Add(Constants.RouteAsHeaderName, originRequest.Headers[Constants.RouteAsHeaderName].ToArray());
            return message;
        }
    }
}