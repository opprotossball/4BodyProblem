predictions = []

def add_prediction(message):
    global predictions
    predictions.append(message)

def clear_predictions():
    global predictions
    predictions = []
    
def get_predictions():
    return predictions
