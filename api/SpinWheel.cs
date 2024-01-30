using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

public static class SpinWheelFunction
{

  [FunctionName("SpinWheel")]
  public static IActionResult Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
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
      log.LogInformation($"SpinWheel - userId: {userId}");

      // Check if the current minute is divisible by 3 and not even number
      if (currentTime.Minute % 3 == 0 && currentTime.Minute % 2 != 0)
      {
         return new OkObjectResult(new { Message = "Can't spin the whill now. Try again later." });
      }
      else
      {
        // Allow the wheel to be spon if the current minute is not divisible by 3
        return new OkObjectResult(new { Message = "Enable the button to spin the wheel." });
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
