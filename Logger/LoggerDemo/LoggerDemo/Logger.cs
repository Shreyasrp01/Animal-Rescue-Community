using System;
using System.IO;

public class Logger
{
    // Singleton instance
    private static Logger _instance;
    private static readonly object _lock = new object();

    private readonly string logFilePath;

    // Private constructor
    private Logger()
    {
        string baseDir = AppContext.BaseDirectory;
        DirectoryInfo dir = new DirectoryInfo(baseDir);

        // Go up until we find the folder containing .csproj
        while (dir != null && !dir.GetFiles("*.csproj").Any())
        {
            dir = dir.Parent;
        }

        if (dir == null)
        {
            throw new Exception("Project root not found");
        }

        string logsDir = Path.Combine(dir.FullName, "Logs");

        if (!Directory.Exists(logsDir))
        {
            Directory.CreateDirectory(logsDir);
        }

        logFilePath = Path.Combine(logsDir, "app.log");
    }



    // Global access point
    public static Logger Instance
    {
        get
        {
            if (_instance == null)
            {
                lock (_lock)
                {
                    if (_instance == null)
                    {
                        _instance = new Logger();
                    }
                }
            }
            return _instance;
        }
    }

    
    public void Log(string message)
    {
        Console.WriteLine("Logged at " + DateTime.Now.ToString() + " - " + message);
        WriteToFile("Logged at " + DateTime.Now.ToString() + " - " + message);
    }

    
    private void WriteToFile(string message)
    {
        using (StreamWriter sw = new StreamWriter(logFilePath, true))
        {
            sw.WriteLine(message);
        }
    }
}
