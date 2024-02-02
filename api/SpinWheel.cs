using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

public static class SpinWheelFunction
{
  [FunctionName("SpinWheel")]
  public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = "prizewheel/spin")] HttpRequest req,
    ILogger log)
  {
    try
    {
      // Get the current time in Eastern Time Zone
      var easternTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");
      var currentTime = TimeZoneInfo.ConvertTime(DateTime.UtcNow, easternTimeZone);

      // Check if the current minute is divisible by 3
      if (currentTime.Minute % 3 == 0)
      {
        throw new Exception("Unexpected spin request. Wheel cannot be spun on these minutes.");
      }
      else
      {
        // Read the request body
        string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        dynamic data = JsonConvert.DeserializeObject(requestBody);

        // Use the values from the request body
        var wheelValues = data?.wheelValues;

        // Pick a random value from wheelValues
        var random = new Random();
        var prizeIndex = random.Next(wheelValues.Count);
        var prizeValue = wheelValues[prizeIndex];
        Console.WriteLine($"Selected Prize Value: {prizeValue}");

        // Return the selected prize value
        return new OkObjectResult(new { PrizeValue = prizeValue });
      }
    }
    catch (Exception ex)
    {
      // Log and return a 500 status code in case of an exception
      log.LogError($"Error in SpinWheelFunction: {ex.Message}\nStackTrace: {ex.StackTrace}");
      return new StatusCodeResult(500);
    }
  }
}