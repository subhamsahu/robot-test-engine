class Utility:
    """
    This class provides utility functions for the application.
    """

    @staticmethod
    def convert_mongo_document_list_to_dict(document_list: list) -> list:
        """
        This function converts a list of MongoDB documents to a list of dictionaries.

        Args:
            document_list (list): A list of MongoDB documents.

        Returns:
            list: A list of dictionaries, where each dictionary represents a converted MongoDB document.
        """
        converted_list = [{k: str(v) if k == '_id' else v for k, v in doc.items()} for doc in document_list]
        return converted_list
    
    @staticmethod
    def convert_mongo_document_to_dict(document: dict) -> dict:
        """
        This function converts a MongoDB document to a dictionary.

        Args:
            document (dict): A MongoDB document.

        Returns:
            dict: A dictionary, where each key-value pair represents a converted MongoDB document field.
        """
        return {
            k: str(v) if k == "_id" else v
            for k, v in document.items()
        }