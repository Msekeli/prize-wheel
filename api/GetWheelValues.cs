using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

public static class GetWheelValuesFunction
{
    private const int V = 6;

    [FunctionName("GetWheelValues")]
    public static IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
        ILogger log)
    {
        try
        {
            // Get the current time in US Eastern Time
            var easternTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");
            var currentTime = TimeZoneInfo.ConvertTime(DateTime.UtcNow, easternTimeZone);

            // Check if the current minute is even
            if (currentTime.Minute % 2 == 0)
            {
                // Generate random values between $0 and $500
                var numberOfSegments = V;
                var randomValues = GenerateRandomValues(numberOfSegments);

                // Log the generated values (optional)
                log.LogInformation($"Generated Wheel Values: {string.Join(", ", randomValues)}");

                // Return the generated values
                return new OkObjectResult(randomValues);
            }
            else
            {
                // Inform the frontend that the wheel may not be spun at odd-numbered minutes
                return new OkObjectResult("Wheel may not be spun at odd-numbered minutes.");
            }
        }
        catch (Exception ex)
        {
            // Handle any unexpected exceptions
            log.LogError($"Error in GetWheelValuesFunction: {ex.Message}");
            return new StatusCodeResult(500); // Internal Server Error
        }
    }

    private static int[] GenerateRandomValues(int numberOfSegments)
    {
        // Implement your logic to generate random values between $0 and $500 here
        var random = new Random();
        var values = new int[numberOfSegments];

        for (int i = 0; i < numberOfSegments; i++)
        {
            values[i] = random.Next(501); // Generates a random value between 0 and 500
        }

        ShuffleArray(values);

        return values;
    }

    private static void ShuffleArray<T>(T[] array)
    {
        // Implement your logic to shuffle the array here
        var random = new Random();

        for (int i = array.Length - 1; i > 0; i--)
        {
            int j = random.Next(0, i + 1);
            T temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
}
