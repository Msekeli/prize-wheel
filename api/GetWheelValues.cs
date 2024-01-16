using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

public static class GetWheelValuesFunction
{
    private static readonly Random RandomGenerator = new Random();
    private const int NumberOfSegments = 6; 

    private const int MaxPrizeAmount = 501; 

    [FunctionName("GetWheelValues")]
    public static IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
        ILogger log)
    {
        try
        {
            var easternTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");
            var currentTime = TimeZoneInfo.ConvertTime(DateTime.UtcNow, easternTimeZone);

            // if (currentTime.Minute % 2 == 0)
            // {
                var randomValues = GenerateRandomValues(NumberOfSegments);

                log.LogInformation($"Generated Wheel Values: {string.Join(", ", randomValues)}");
                return new OkObjectResult(randomValues);
            // }
            // else
            // {
            //     return new OkObjectResult(new { Message = "Wheel may not be spun at odd-numbered minutes." });
            // }
        }
        catch (Exception ex)
        {

            log.LogError($"Error in GetWheelValuesFunction: {ex}");
            return new StatusCodeResult(500);
        }
    }

    private static int[] GenerateRandomValues(int numberOfSegments)
    {
        var values = new int[numberOfSegments];

        for (int i = 0; i < numberOfSegments; i++)
        {
            values[i] = RandomGenerator.Next(MaxPrizeAmount);
        }
        ShuffleArray(values);
        return values;
    }

    private static void ShuffleArray<T>(T[] array)
    {
        for (int i = array.Length - 1; i > 0; i--)
        {
            int j = RandomGenerator.Next(0, i + 1);
            T temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
}
