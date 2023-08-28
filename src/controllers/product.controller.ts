import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  Request,
  requestBody,
  Response,
  response,
  RestBindings,
} from '@loopback/rest';
import {Product, ProductWithRelations} from '../models';
import {ProductRepository, TagRepository} from '../repositories';
import {inject} from '@loopback/core';

import {FileUploadService} from '../utils/fileUpload.service';
import fs, {promises as fsPromises} from 'fs';
import {join, relative} from 'path';

export class ProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
    @repository(TagRepository)
    public tagRepository: TagRepository,  // Добавьте эту строку
  ) {
  }

  @post('/products')
  @response(200, {
    description: 'Product model instance',
    content: {'application/json': {schema: getModelSchemaRef(Product)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProduct',
            exclude: ['id'],
          }),
        },
      },
    })
      product: Omit<Product, 'id'>,
  ): Promise<Product> {
    return this.productRepository.create(product);
  }

  @get('/products/count')
  @response(200, {
    description: 'Product model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Product) where?: Where<Product>,
  ): Promise<Count> {
    return this.productRepository.count(where);
  }

  @get('/products')
  @response(200, {
    description: 'Array of Product model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Product) filter?: Filter<Product>,
  ): Promise<Product[]> {
    const products = await this.productRepository.find(filter);
    await Promise.all(products.map(async (product) => {
      product.tags = await this.tagRepository.find({
        where: {
          _id: {
            in: product.tagIds,
          },
        },
      });
    }));
    return products;
  }

  @get('/visible-products')
  @response(200, {
    description: 'Array of visible Product model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, {includeRelations: true}),
        },
      },
    },
  })
  async findVisible(): Promise<Product[]> {
    try {
      const products = await this.productRepository.find({where: {hidden: false}});
      await Promise.all(products.map(async (product) => {
        product.tags = await this.tagRepository.find({
          where: {
            _id: {
              in: product.tagIds,
            },
          },
        });
      }));
      return products;
    } catch (e) {
      throw new HttpErrors.InternalServerError(
        'Error retrieving visible products',
      );
    }
  }

  @patch('/products')
  @response(200, {
    description: 'Product PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
      product: Product,
    @param.where(Product) where?: Where<Product>,
  ): Promise<Count> {
    return this.productRepository.updateAll(product, where);
  }

  @get('/products/{id}')
  @response(200, {
    description: 'Product model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Product, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Product, {exclude: 'where'}) filter?: FilterExcludingWhere<Product>,
  ): Promise<ProductWithRelations> {
    const product = await this.productRepository.findById(id, filter);

    product.tags = await this.tagRepository.find({
      where: {
        _id: {
          in: product.tagIds,
        },
      },
    });

    return product;
  }

  @patch('/products/{id}')
  @response(204, {
    description: 'Product PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
      product: Product,
  ): Promise<void> {
    await this.productRepository.updateById(id, product);
  }

  @put('/products/{id}')
  @response(204, {
    description: 'Product PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() product: Product,
  ): Promise<void> {
    await this.productRepository.replaceById(id, product);
  }

  @del('/products/{id}')
  @response(204, {
    description: 'Product DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.productRepository.deleteById(id);
  }

  @post('/products/{id}/thumbnail')
  @response(200, {
    description: 'Product thumbnail upload',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            filename: {type: 'string'},
            path: {type: 'string'},
          },
        },
      },
    },
  })
  async uploadThumbnail(
    @param.path.string('id') id: string,
    @inject(RestBindings.Http.REQUEST) req: Request,
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<{filename: string, path: string}> {

    const fileUploadService = new FileUploadService();
    const file = await fileUploadService.uploadFile(req, res);

    if (!file) {
      throw new HttpErrors.BadRequest('File not uploaded');
    }

    const baseDir = join(__dirname, '../../public');
    const relativePath = relative(baseDir, file.path);

    const productToUpdate = await this.productRepository.findById(id);
    if (!productToUpdate) {
      throw new HttpErrors.NotFound(`Product with id ${id} not found`);
    }


    const oldThumbnailPath = productToUpdate.thumbnail;

    productToUpdate.thumbnail = relativePath;
    await this.productRepository.updateById(id, productToUpdate);

    const absoluteOldThumbnailPath = join(__dirname, '../../public', oldThumbnailPath);

    if (fs.existsSync(absoluteOldThumbnailPath)) {
      try {
        fs.unlinkSync(absoluteOldThumbnailPath);
        console.log('File deleted successfully:', oldThumbnailPath);
      } catch (e) {
        console.log('Error deleting file:', oldThumbnailPath);
      }
    }
    return {filename: file.filename, path: file.path};
  }

  @get('/uploads/{filename}', {
    responses: {
      '200': {
        description: 'Uploaded File',
        content: {
          'image/jpeg': {schema: {type: 'string', format: 'binary'}},
          'image/png': {schema: {type: 'string', format: 'binary'}},
        },
      },
    },
  })
  async getUploadedFile(
    @param.path.string('filename') filename: string,
  ): Promise<Buffer> {
    const absolutePath = join(__dirname, '../../public/uploads', filename);
    if (!fs.existsSync(absolutePath)) {
      throw new HttpErrors.NotFound(`File ${filename} not found`);
    }

    try {
      return await fsPromises.readFile(absolutePath);
    } catch (error) {
      throw new HttpErrors.NotFound(`Error reading file ${filename}`);
    }
  }

}