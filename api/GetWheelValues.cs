using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

public static class GetWheelValuesFunction
{
    // Random number generator for generating prize values
    private static readonly Random RandomGenerator = new Random();

    // Number of segments on the wheel
    private const int NumberOfSegments = 6;

    // Maximum prize amount that can be won
    private const int MaxPrizeAmount = 500;

    [FunctionName("GetWheelValues")]
    public static IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "prizewheel/getvalues")] HttpRequest req,
        ILogger log)
    {
        try
        {
            // Retrieve userId from the query parameters
            string userId = req.Query["userId"];

            // Get the current time in Eastern Time Zone
            var easternTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");
            var currentTime = TimeZoneInfo.ConvertTime(DateTime.UtcNow, easternTimeZone);

            // Log userId for tracking
            log.LogInformation($"GetWheelValues - userId: {userId}");

            // Check if the current minute is even
            if (currentTime.Minute % 2 == 0)
            {
                // Generate random values for the wheel
                var randomValues = GenerateRandomValues(NumberOfSegments);

                // Log the generated values
                log.LogInformation($"Generated Wheel Values: {string.Join(", ", randomValues)}");

                // Return the generated values as OK response
                return new OkObjectResult(randomValues);
            }
            else
            {
                // Return a message if wheel spin is not allowed at odd-numbered minutes
                return new OkObjectResult(new { Message = "Wheel may not be spun at odd-numbered minutes." });
            }
        }
        catch (Exception ex)
        {
            // Log and return a 500 status code in case of an exception
            log.LogError($"Error in GetWheelValuesFunction: {ex.Message}\nStackTrace: {ex.StackTrace}");
            return new StatusCodeResult(500);
        }
    }

    // Generate random values for the wheel segments
    private static int[] GenerateRandomValues(int numberOfSegments)
    {
        var values = new int[numberOfSegments];

        for (int i = 0; i < numberOfSegments; i++)
        {
            values[i] = RandomGenerator.Next(MaxPrizeAmount);
        }

        return values;
    }
}
