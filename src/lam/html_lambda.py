




def html_function(event, context):
    f = open("templates/hello.html", "r")
    return {"statusCode": 200, "headers": {"Content-Type": "text/html"}, "body": f.read() }