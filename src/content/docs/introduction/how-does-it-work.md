---

title: How Default Uploader Works and Its Structure

---

Default Uploader is a powerful and flexible service for uploading, optimizing, and transforming files. Its architecture is designed to provide high performance, scalability, and security. Let's take a look at how this service is structured and how the file processing workflow operates.

### Service Architecture

1. **Load Balancer**
   - Incoming requests first go to the load balancer, which evenly distributes them among the applications. This allows for efficient traffic management and prevents overloading individual components.

2. **Applications**
   - Applications are responsible for handling user requests. When a file transformation request is received, the application checks if the transformed file already exists. If it does, the file is immediately delivered to the user. If not, a transformation job is created.

3. **Workers**
   - Workers handle the actual file transformations. After receiving a job from the application, the worker performs the necessary transformation and saves the resulting file to the chosen storage. The worker then notifies the application that the file is ready.

4. **Storage**
   - Storage is used for saving original and transformed files. Users can choose any S3-compatible storage or CDN, providing flexibility in managing the infrastructure.

5. **Distributed Cache**
   - To speed up request processing, secret keys and other critical information are stored in a distributed cache. This allows quick access to data and minimizes latency. All keys are stored in encrypted form to ensure security.

6. **Scalability**
   - Applications and workers can be easily scaled both horizontally (adding new servers) and vertically (increasing the power of existing servers), allowing the service to adapt to any traffic volumes and loads.

### File Transformation Process

1. **Transformation Request**
   - The user sends a file transformation request, specifying the necessary parameters via URL.

2. **File Availability Check**
   - The application checks if a file with the required parameters already exists. If found, the file is immediately returned to the user.

3. **Job Creation**
   - If the file is not found, the application creates a job for its transformation and passes it to a worker.

4. **File Transformation**
   - The worker performs the necessary transformation (resizing, format change, etc.), saves the finished file to storage, and notifies the application of the task's completion.

5. **File Delivery**
   - Once the file is ready, the application returns it to the user. If the user requests the file again with the same parameters, they will instantly receive the already prepared file from storage.

### Conclusion

The architecture of Default Uploader is designed to ensure reliable and fast file processing, minimize latency, and guarantee data security. Its flexibility, scalability, and efficient resource management make it an ideal solution for various projects requiring the processing of large volumes of media files.