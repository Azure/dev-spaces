//
// Use the code in this file to propagate specific headers from an existing
// ASP .NET HttpRequest object into an outgoing HttpRequestMessage object.
// 
// Example usage from inside an ASP .NET controller:
//
//   using (var client = new HeaderPropagatingHttpClient(this.Request))
//   {
//       var response = await client.GetAsync("http://backend");
//   }
//

using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using Microsoft.AspNetCore.Http;

namespace mywebapi
{
    public class HeaderPropagatingHttpClient : HttpClient
    {
        public HeaderPropagatingHttpClient(HttpRequest source)
            : this(source, null)
        {
        }

        public HeaderPropagatingHttpClient(HttpRequest source, HttpMessageHandler innerHandler)
            : this(source, null, innerHandler)
        {
        }

        public HeaderPropagatingHttpClient(HttpRequest source, string metaHeaderName, HttpMessageHandler innerHandler)
            : base(new HeaderPropagatingHttpHandler(source, metaHeaderName, innerHandler))
        {
        }
    }

    public class HeaderPropagatingHttpHandler : MessageProcessingHandler
    {
        public HeaderPropagatingHttpHandler(HttpRequest source, string metaHeaderName = null, HttpMessageHandler innerHandler = null)
            : base(innerHandler ?? new HttpClientHandler())
        {
            this.Source = source ?? throw new ArgumentNullException(nameof(source));
            this.MetaHeaderName = metaHeaderName ?? "Context-Headers";
        }

        public HttpRequest Source { get; private set; }

        public string MetaHeaderName { get; set; }

        protected override HttpRequestMessage ProcessRequest(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            if (this.Source.Headers.ContainsKey(this.MetaHeaderName))
            {
                request.Headers.Add(this.MetaHeaderName, this.Source.Headers[this.MetaHeaderName] as IEnumerable<string>);
                foreach (var header in this.Source.Headers[this.MetaHeaderName])
                {
                    if (header[header.Length - 1] == '*')
                    {
                        var prefix = header.Substring(0, header.Length - 1);
                        foreach (var candidate in this.Source.Headers.Keys)
                        {
                            if (candidate.IndexOf(prefix) == 0)
                            {
                                request.Headers.Add(candidate, this.Source.Headers[candidate] as IEnumerable<string>);
                            }
                        }
                    }
                    else if (this.Source.Headers.ContainsKey(header))
                    {
                        request.Headers.Add(header, this.Source.Headers[header] as IEnumerable<string>);
                    }
                }
            }
            return request;
        }

        protected override HttpResponseMessage ProcessResponse(HttpResponseMessage response, CancellationToken cancellationToken)
        {
            return response;
        }
    }
}
