public class SQLServer
{
    public void Insert()
    {
        Console.WriteLine("SQL Server Insert Done!");
        Logger.Instance.Log("Audited : Insert in SQLServer");
    }

    public void Update()
    {
        Console.WriteLine("SQL Server Update Done!");
        Logger.Instance.Log("Audited : Update in SQLServer");
    }
}
