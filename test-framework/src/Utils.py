import json
import random, string

VERSION = 'v0.1'


def is_json(data):
    try:
        json.loads(data)
    except (TypeError, ValueError):
        return False
    return True


def json_pretty_print(content):
    """
    Pretty print a JSON object

    ``content``  JSON object to pretty print
    """
    temp = json.loads(content)
    return json.dumps(
        temp,
        sort_keys=True,
        indent=4,
        separators=(
            ',',
            ': '))


def update_nested_dict_value(d: dict, target_key, new_value):
    """
    Update the value associated with the target_key in a nested dictionary.

    Parameters:
    d (dict): The nested dictionary.
    target_key: The key whose value needs to be updated.
    new_value: The new value to set for the target_key.

    Returns:
    dict: The updated nested dictionary.
    """
    for key, value in d.items():
        if key == target_key:
            d[key] = new_value
        elif isinstance(value, dict):
            update_nested_dict_value(value, target_key, new_value)
    return d


def update_nested_value(obj, target_key, new_value):
    """
    Update the value associated with the target_key in a nested dictionary or list.

    Parameters:
    obj (dict or list): The nested dictionary or list.
    target_key: The key or index whose value needs to be updated.
    new_value: The new value to set for the target_key.

    Returns:
    dict or list: The updated nested dictionary or list.
    """
    if isinstance(obj, dict):
        for key, value in obj.items():
            if key == target_key:
                obj[key] = new_value
            elif isinstance(value, (dict, list)):
                update_nested_value(value, target_key, new_value)
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            if isinstance(item, (dict, list)):
                update_nested_value(item, target_key, new_value)

    return obj


def delete_nested_dict_key(d, target_key):
    keys_to_delete = []

    for key, value in d.items():
        if key == target_key:
            keys_to_delete.append(key)
        elif isinstance(value, dict):
            delete_nested_dict_key(value, target_key)

    for key in keys_to_delete:
        del d[key]
    return d


def deep_dict_delete(d, key_to_delete):
    if isinstance(d, dict):
        # Check if the key to delete is in the current dictionary
        if key_to_delete in d:
            del d[key_to_delete]
        # Recursively check and delete in nested dictionaries
        for key, value in d.items():
            deep_dict_delete(value, key_to_delete)
    elif isinstance(d, list):
        # Recursively check and delete in list elements that are dictionaries
        for item in d:
            deep_dict_delete(item, key_to_delete)
    return d


def load_json_file(file_path):
    try:
        data = None
        with open(file_path, 'r') as fin:
            data = json.loads(fin.read())
        return data
    except Exception as e:
        return None

def generate_random_name(self,prefix='prefix', length=7):
    """
    This method is used to generate random name

    :param data: None
    :return: random name
    """
    N = length
    res = f'{prefix}_' + ''.join(random.choices(string.ascii_lowercase +
                                                     string.digits, k=N))
    return res

