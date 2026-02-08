namespace LoggerDemo
{
    class Program
    {
        static void Main(string[] args)
        {
            Logger.Instance.Log("Logger Service Started on http://localhost:5000/");
            
            using (System.Net.HttpListener listener = new System.Net.HttpListener())
            {
                listener.Prefixes.Add("http://localhost:5000/");
                listener.Start();
                Console.WriteLine("Listening for logs...");

                while (true)
                {
                    try
                    {
                        var context = listener.GetContext();
                        if (context.Request.HttpMethod == "POST")
                        {
                            using (var reader = new System.IO.StreamReader(context.Request.InputStream, context.Request.ContentEncoding))
                            {
                                string text = reader.ReadToEnd();
                                Logger.Instance.Log("Received: " + text);
                            }
                            context.Response.StatusCode = 200;
                        }
                        else
                        {
                            context.Response.StatusCode = 404;
                        }
                        context.Response.Close();
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Error: " + ex.Message);
                    }
                }
            }
        }
    }

}
