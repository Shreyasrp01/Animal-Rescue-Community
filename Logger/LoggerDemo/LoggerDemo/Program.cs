namespace LoggerDemo
{
    class Program
    {
        static void Main(string[] args)
        {
            Logger.Instance.Log("Main Started");

            SQLServer db = new SQLServer();
            db.Insert();
            db.Update();

            Console.ReadLine();
        }
    }

}
